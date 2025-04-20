import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Text,
    Img,
  } from "@react-email/components";
  import * as React from "react";
  
  interface AddAdminEmailProps {
    name: string;
    site: {
      name: string;
      logo: string;
      domainName: string;
      themeName: string;
    };
  }
  
  export const AddAdminEmail = ({
    name,
    site,
  }: AddAdminEmailProps) => (
    <Html data-theme={site.themeName}>
      <Head />
      <Preview>You have been added as an admin to the site {site.name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`https://res.cloudinary.com/dn3cywkpn/image/upload/c_limit,w_2048/f_auto/q_auto/v1/${site.logo}?_a=BAVCluDW0`}
            width="100"
            height="100"
            alt={site.name}
            style={logo}
          />
          <Text style={paragraph}>Hi {name},</Text>
          <Text style={paragraph}>Congratulations! You have been added as an admin to the site {site.name}.</Text>
          <Text style={paragraph}>Your journey with {site.name} has just begun to create your courses and manage your students.</Text>
          <Text style={paragraph}>Click on the button below to go to the login page and reset your password</Text>
          <Section style={btnContainer}>
            <Button style={button} href={`${process.env.NEXT_PUBLIC_ROOT_URL}/auth/reset-password`}>
              Reset password
            </Button>
          </Section>
          <Text style={paragraph}>If you need any help, please contact us at help@cubite.io</Text>
        </Container>
      </Body>
    </Html>
  );
  
  AddAdminEmail.PreviewProps = {
    name: "Alan",
    site: {
      name: "Acme",
      logo: "courseCovers/z4o7fbpselehs3jmt1rg",
      domainName: "http://localhost:3000",
      themeName: "lofi",
    },
  } as AddAdminEmailProps;
  
  export default AddAdminEmail;
  
  const main = {
    backgroundColor: "#ffffff",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
  };
  
  const logo = {
    margin: "0 auto",
  };
  
  const paragraph = {
    fontSize: "16px",
    lineHeight: "26px",
  };
  
  const btnContainer = {
    textAlign: "center" as const,
  };
  
  const button = {
    backgroundColor: "#000",
    borderRadius: "3px",
    color: "#fff",
    fontSize: "16px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px",
  };
  
  const hr = {
    borderColor: "#cccccc",
    margin: "20px 0",
  };
  
  const footer = {
    color: "#8898aa",
    fontSize: "12px",
  };
  