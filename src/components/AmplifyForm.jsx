import { Authenticator, PasswordField, TextField, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import classes from './AmplifyForm.module.css';

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

const AmplifyForm = ({ onClose }) => {
  return (
    <ThemeProvider theme={CustomTheme}>
      <button className={classes.modal_close_button} onClick={onClose}>×</button>
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