export type userReceivedInfo = {
  userName: string;
  userEmail: string;
  userCPF: string;
  userPhone: string;
};

export type userSignupInfo = {
  id: string;
  confirmationId: string;
  valid: boolean;
  invoice: {
    customerName: string;
    customerCPF: string;
    customerPhoneNumber: string;
    customerEmail: string;
  };
};
