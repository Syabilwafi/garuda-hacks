import { apiClient } from '@/utils';

export async function submitScreeningAssessment(payload: {
    userId: string;
    bookingId: string;
    triageStatus: string;
    triageAnswers: Record<string, string>;
    selectedIntensity: number;
    paintedPoints: any[];
    healthDescription: string;
}) {
    return await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}/api/screening/submit`,
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    );
}
