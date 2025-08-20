export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^(\+972|0)([23489]|5[0248]|77)[1-9]\d{6}$/;
    return phoneRegex.test(phoneNumber);
  };
  
  export const validateAge = (age: string) => {
    const ageNumber = Number(age);
    return ageNumber >= 0 && ageNumber <= 120;
  };