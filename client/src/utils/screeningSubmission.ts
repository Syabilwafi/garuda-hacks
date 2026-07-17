// Mock storage for screening assessments
let screeningAssessmentsStorage: Record<string, any> = {};

export async function submitScreeningAssessment(payload: {
    userId: string;
    bookingId: string;
    triageStatus: string;
    triageAnswers: Record<string, string>;
    selectedIntensity: number;
    paintedPoints: any[];
    healthDescription: string;
}) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Store the assessment in mock storage
            screeningAssessmentsStorage[payload.bookingId] = {
                ...payload,
                submittedAt: new Date().toISOString(),
                id: `SA-${Date.now()}`
            };

            resolve({
                success: true,
                message: "Screening assessment submitted successfully",
                assessmentId: `SA-${Date.now()}`,
                data: payload
            });
        }, 500);
    });
}
