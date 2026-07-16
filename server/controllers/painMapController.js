// server/controllers/painMapController.js
import { AnatomicalZone } from '../models/anatomicalZone.js';

export const generateAssessmentController = async (req, res) => {
    try {
        const { patientId, painMarks } = req.body; // Matches frontend payload schema

        if (!painMarks || painMarks.length === 0) {
            return res.status(400).json({ error: "No pain markers supplied" });
        }

        const primaryMark = painMarks[0];
        const { x, y, z } = primaryMark.coordinate3D;
        const painType = primaryMark.painType;

        // Search for zone matching the 3D selection point
        const match = await AnatomicalZone.findZoneAndNodesByCoordinates(x, y, z, painType);

        if (match) {
            // Reformat data fields to perfectly match AssessmentResponse interface types
            return res.status(200).json({
                medical: {
                    complaint: match.complaint,
                    indication: match.indication,
                    affectedAreas: match.affected_areas
                },
                traditional: {
                    highlightedNodes: match.nodes.map(n => ({
                        id: n.id,
                        label: n.label,
                        coordinate3D: { x: n.x, y: n.y, z: n.z }
                    })),
                    instructions: match.instructions,
                    contraindications: match.contraindications
                }
            });
        }

        // Fallback Mock Dictionary if the click lands out-of-bounds during live presentation
        const fallbackResponse = getLiveFallback(painType, x, y, z);
        return res.status(200).json(fallbackResponse);

    } catch (error) {
        console.error("Express routing handler collapsed:", error);
        return res.status(500).json({ error: "Internal execution processing failure" });
    }
};

function getLiveFallback(painType, x, y, z) {
    // Matches exact types and fallbacks configured in assessmentApi.ts
    const mockDatabase = {
        THROBBING: {
            medical: {
                complaint: "Nyeri berdenyut di area kepala dan leher",
                indication: "Kemungkinan tension headache yang terkait ketegangan otot servikal",
                affectedAreas: ["Temporalis", "Occipitalis", "Sternocleidomastoid"]
            },
            traditional: {
                highlightedNodes: [
                    { id: "temple-01", label: "Titik Pelipis (Taiyang)", coordinate3D: { x: 0.1, y: 1.7, z: 0.1 } },
                    { id: "crown-01", label: "Titik Puncak Kepala (Baihui)", coordinate3D: { x: 0, y: 1.8, z: 0 } }
                ],
                instructions: "Tekan lembut titik Taiyang di kedua sisi pelipis secara bersamaan. Pijat melingkar pada puncak kepala.",
                contraindications: ["Jangan tekan terlalu keras pada area kepala.", "Hindari pijatan jika sakit kepala sangat parah."]
            }
        }
    };

    return mockDatabase[painType] || {
        medical: {
            complaint: `Nyeri ${painType.replace('_', ' ')} terdeteksi`,
            indication: "Kekakuan jaringan lunak umum",
            affectedAreas: ["General Musculoskeletal System"]
        },
        traditional: {
            highlightedNodes: [{ id: "dynamic-node", label: "Titik Resonansi Lokal", coordinate3D: { x, y: y + 0.05, z } }],
            instructions: "Berikan kompres hangat teratur pada area pusat ketegangan.",
            contraindications: ["Hindari manipulasi dalam jika peradangan meningkat."]
        }
    };
}