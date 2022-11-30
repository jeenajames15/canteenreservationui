export default function validate(values) {
  let errors = {};
  if (!values.email) {
    errors.email = 'Email address is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email address is invalid';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be 8 or more characters';
  }
  if (!values.confirm_password) {
    errors.confirm_password = 'Confirm password is required';
  } else if (values.password !== values.confirm_password) {
    errors.confirm_password = 'password should be equal';
  }
  if (!values.firstName) {
    errors.first_name = 'First name is required';
  }
  if (!values.lastName) {
    errors.last_name = 'Last name is required';
  }
  if (!values.phone) {
    errors.phone_num = 'Phone Number not entered';
  } else if (
    !/^\d+$/.test(values.phone) ||
    values.phone.length !== 10
  ) {
    errors.phone_num = 'Invalid Phone number';
  }
  if (!values.address) {
    errors.address = 'Enter address';
  } else if (values.address.length >= 45) {
    errors.address = 'Enter smaller address';
  }
  if (!values.securityAnswer) {
    errors.securityAnswer = 'Security Answer is required';
  }
  
  return errors;
}
