import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendShipmentEmail, buildTrackingLink } from "@/lib/email";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { getRequest } from "@tanstack/react-start/server";

// ---------- Rate limiting middleware ----------

function requireRateLimit(request?: Request) {
  const key = getRateLimitKey(request);
  const result = checkRateLimit(key);
  if (!result.allowed) {
    throw new Error("Too many requests. Please try again later.");
  }
}

// ---------- Admin helpers ----------

async function isAdmin(email: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  return Boolean(data);
}

// ---------- Input sanitization ----------

function sanitizeString(value: unknown, maxLength = 2000): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[<>]/g, "").slice(0, maxLength);
}

function sanitizeOptional(value: unknown, maxLength = 2000): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  return sanitizeString(value, maxLength);
}

export type CreateShipmentInput = {
  tracking_number: string;
  reference?: string | null;
  origin: string;
  destination: string;
  mode: string;
  status?: string;
  current_location?: string | null;
  eta?: string | null;
  shipper?: string | null;
  consignee?: string | null;
  cargo?: string | null;
  customer_email?: string | null;
  notify: boolean;
  baseUrl: string;
};

export const createShipment = createServerFn({ method: "POST" })
  .validator((d: CreateShipmentInput) => d)
  .handler(async ({ data }) => {
    const {
      tracking_number,
      reference,
      origin,
      destination,
      mode,
      status,
      current_location,
      eta,
      shipper,
      consignee,
      cargo,
      customer_email,
      notify,
      baseUrl,
    } = data;

    if (!tracking_number || !origin || !destination) {
      throw new Error("Tracking number, origin and destination are required.");
    }

    const { data: shipment, error } = await supabaseAdmin
      .from("shipments")
      .insert({
        tracking_number,
        reference,
        origin,
        destination,
        mode,
        status: status ?? "booked",
        current_location,
        eta,
        shipper,
        consignee,
        cargo,
        customer_email,
      })
      .select("*")
      .single();

    if (error) throw error;

    // Create the initial "booked" tracking event
    if (shipment) {
      await supabaseAdmin.from("tracking_events").insert({
        shipment_id: shipment.id,
        status: status ?? "booked",
        location: current_location ?? origin,
        notes: "Shipment created. Booking confirmed.",
        event_at: new Date().toISOString(),
      });
    }

    // Send email notification
    let notificationStatus = "none";
    if (notify && customer_email && shipment) {
      try {
        await sendShipmentEmail({
          tracking_number: shipment.tracking_number,
          origin: shipment.origin,
          destination: shipment.destination,
          mode: shipment.mode,
          status: shipment.status,
          current_location: shipment.current_location,
          eta: shipment.eta,
          customer_email,
          baseUrl,
        });
        notificationStatus = "sent";
        await supabaseAdmin.from("notifications").insert({
          shipment_id: shipment.id,
          email: customer_email,
          type: "shipment_created",
          subject: `Your C Link shipment ${shipment.tracking_number}`,
          status: "sent",
          provider: "resend",
          sent_at: new Date().toISOString(),
        });
      } catch (e) {
        notificationStatus = "failed";
        await supabaseAdmin.from("notifications").insert({
          shipment_id: shipment.id,
          email: customer_email,
          type: "shipment_created",
          subject: `Your C Link shipment ${shipment.tracking_number}`,
          status: "failed",
          provider: "resend",
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    return { shipment, notificationStatus, trackingLink: shipment ? buildTrackingLink(baseUrl, shipment.tracking_number) : null };
  });

export type AddEventInput = {
  shipment_id: string;
  status: string;
  location?: string | null;
  notes?: string | null;
  event_at?: string | null;
};

export const addTrackingEvent = createServerFn({ method: "POST" })
  .validator((d: AddEventInput) => d)
  .handler(async ({ data }) => {
    const { shipment_id, status, location, notes, event_at } = data;
    if (!shipment_id || !status) {
      throw new Error("shipment_id and status are required.");
    }

    const { data: event, error } = await supabaseAdmin
      .from("tracking_events")
      .insert({
        shipment_id,
        status,
        location,
        notes,
        event_at: event_at ?? new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) throw error;

    // Update the shipment's current status
    const { error: updateErr } = await supabaseAdmin
      .from("shipments")
      .update({ status, current_location: location ?? undefined, updated_at: new Date().toISOString() })
      .eq("id", shipment_id);
    if (updateErr) throw updateErr;

    return { event };
  });

export type UpdateShipmentStatusInput = {
  shipment_id: string;
  status: string;
  current_location?: string | null;
};

export const updateShipmentStatus = createServerFn({ method: "POST" })
  .validator((d: UpdateShipmentStatusInput) => d)
  .handler(async ({ data }) => {
    const { shipment_id, status, current_location } = data;
    if (!shipment_id || !status) throw new Error("shipment_id and status are required.");

    const { data: shipment, error } = await supabaseAdmin
      .from("shipments")
      .update({ status, current_location: current_location ?? undefined, updated_at: new Date().toISOString() })
      .eq("id", shipment_id)
      .select("*")
      .single();
    if (error) throw error;
    return { shipment };
  });

// ---------- Delete shipment (admin only) ----------

export type DeleteShipmentInput = {
  shipment_id: string;
};

export const deleteShipment = createServerFn({ method: "POST" })
  .validator((d: DeleteShipmentInput) => d)
  .handler(async ({ data }) => {
    const { shipment_id } = data;
    if (!shipment_id) throw new Error("Shipment ID is required.");

    // Get the request to check session
    const request = getRequest();
    requireRateLimit(request);

    // Verify admin session
    const authHeader = request?.headers?.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user?.email) {
      throw new Error("Unauthorized");
    }

    const admin = await isAdmin(userData.user.email);
    if (!admin) {
      throw new Error("Access denied. Admin privileges required.");
    }

    // Delete in correct order (tracking_events, notifications, then shipment)
    const { error: eventsErr } = await supabaseAdmin
      .from("tracking_events")
      .delete()
      .eq("shipment_id", shipment_id);
    if (eventsErr) throw eventsErr;

    const { error: notifErr } = await supabaseAdmin
      .from("notifications")
      .delete()
      .eq("shipment_id", shipment_id);
    if (notifErr) throw notifErr;

    const { error: shipErr } = await supabaseAdmin
      .from("shipments")
      .delete()
      .eq("id", shipment_id);
    if (shipErr) throw shipErr;

    return { deleted: true };
  });

// ---------- Export shipment as JSON (download) ----------

export type ExportShipmentInput = {
  shipment_id: string;
};

export const exportShipment = createServerFn({ method: "POST" })
  .validator((d: ExportShipmentInput) => d)
  .handler(async ({ data }) => {
    const { shipment_id } = data;
    if (!shipment_id) throw new Error("Shipment ID is required.");

    const request = getRequest();
    requireRateLimit(request);

    // Verify admin session
    const authHeader = request?.headers?.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user?.email) {
      throw new Error("Unauthorized");
    }

    const admin = await isAdmin(userData.user.email);
    if (!admin) {
      throw new Error("Access denied. Admin privileges required.");
    }

    const [{ data: shipment }, { data: events }, { data: notifications }] = await Promise.all([
      supabaseAdmin.from("shipments").select("*").eq("id", shipment_id).single(),
      supabaseAdmin.from("tracking_events").select("*").eq("shipment_id", shipment_id).order("event_at", { ascending: true }),
      supabaseAdmin.from("notifications").select("*").eq("shipment_id", shipment_id).order("created_at", { ascending: true }),
    ]);

    if (!shipment) throw new Error("Shipment not found.");

    return {
      exported_at: new Date().toISOString(),
      shipment,
      tracking_events: events ?? [],
      notifications: notifications ?? [],
    };
  });

