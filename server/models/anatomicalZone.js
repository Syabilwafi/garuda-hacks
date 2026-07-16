// server/models/anatomicalZone.js
import { supabase } from '../config/supabase.js';

export const AnatomicalZone = {
    findZoneAndNodesByCoordinates: async (x, y, z, painType) => {
        // Query matching the spatial intersect boundaries
        const { data: zone, error: zoneError } = await supabase
            .from('anatomical_zones')
            .select('*')
            .eq('pain_type', painType)
            .lte('x_min', x)
            .gte('x_max', x)
            .lte('y_min', y)
            .gte('y_max', y)
            .lte('z_min', z)
            .gte('z_max', z)
            .maybeSingle();

        if (zoneError) {
            console.error("Database query exception:", zoneError.message);
            return null;
        }

        if (!zone) return null;

        const { data: nodes, error: nodesError } = await supabase
            .from('meridian_nodes')
            .select('id, label, x, y, z')
            .eq('zone_id', zone.id);

        if (nodesError) {
            console.error("Failed to pull linked acupoint nodes:", nodesError.message);
        }

        return {
            ...zone,
            nodes: nodes || []
        };
    }
};