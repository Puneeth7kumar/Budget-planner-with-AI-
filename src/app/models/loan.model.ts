export interface Loan {
    amount: number;
    interestRate: number;
    term: number; // in months
    emi?: number; // calculated EMI
    loanType: string;
    documents: File | null;
    disbursementMethod: string;
    income: number;
    existingCreditScore: number;
    employmentStatus: string;
}
