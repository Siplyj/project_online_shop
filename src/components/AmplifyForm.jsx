import { Authenticator, TextField, PasswordField, ThemeProvider } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';

export const CustomTheme = {
  name: 'custom-theme',
  tokens: {
    fonts: {
      default: {
        static: 'Finlandica, sans-serif',
        variable: 'Finlandica, sans-serif',
      },
    },
    colors: {
      font: {
        primary: { value: '#111111' },
        secondary: { value: '#999999' },
        inverse: { value: '#ffffff' },
      },
      background: {
        primary: { value: '#ffffff' },
        secondary: { value: '#f7f7f7' },
      },
      brand: {
        primary: {
          10: { value: '#ededed' },
          80: { value: '#616677' },
          100: { value: '#525665' },
        },
      },
      border: {
        primary: { value: '#cccccc' },
      },
    },
    components: {
      button: {
        primary: {
          backgroundColor: { value: '#616677' },
          color: { value: '#ffffff' },
          _hover: {
            backgroundColor: { value: '#525665' },
          },
        },
      },
    },
  },
};

const AmplifyForm = () => {
  return (
    <ThemeProvider theme={CustomTheme}>
      <Authenticator
        variation="modal"
        components={{
          SignUp: {
            FormFields: () => (
              <>
                <TextField name="username" label="Username" />
                <TextField name="email" label="Email" />
                <PasswordField name="password" label="Password" />
                <PasswordField name="confirm_password" label="Confirm Password" />
              </>
            ),
          },
        }}
      />
    </ThemeProvider>
  );
};


export default AmplifyForm;