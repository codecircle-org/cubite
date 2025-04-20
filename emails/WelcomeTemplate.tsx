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
  Heading,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  userFirstname: string;
  site: {
    name: string;
    logo: string;
    domainName: string;
    themeName: string;
    contactEmail: string;
    customDomain: string;
  };
}

// Define theme colors based on your DaisyUI themes
const themeColors = {
  rmu: {
    primary: "#013120",
    secondary: "#016936",
    accent: "#9D9B63",
    background: "#e6e7d8",
  },
  ocean: {
    primary: "#2980b9",
    secondary: "#36b6ff",
    accent: "#191654",
    background: "#ebf5f7",
  },
  codeCircle: {
    primary: "#014aad",
    secondary: "#77e0f2",
    background: "#ffffff",
  },
  ncec: {
    primary: "#191654",
    secondary: "#43c6ac",
    accent: "#43c6ac",
    neutral: "#04313d",
    background: "#ffffff",
  },
  light: {
    primary: "#570df8",
    secondary: "#f000b8",
    background: "#ffffff",
  },
  dark: {
    primary: "#661AE6",
    secondary: "#D926AA",
    background: "#1d232a",
  },
  cupcake: {
    primary: "#65c3c8",
    secondary: "#ef9fbc",
    background: "#faf7f5",
  },
  corporate: {
    primary: "#4b6bfb",
    secondary: "#7b92b2",
    background: "#ffffff",
  },
  winter: {
    primary: "#147efb",
    secondary: "#ef9fbc",
    background: "#ffffff",
  },
  // Add other themes as needed
};

export const WelcomeEmail = ({ userFirstname, site }: WelcomeEmailProps) => {
  const colors =
    themeColors[site.themeName as keyof typeof themeColors] || themeColors.ncec;

  return (
    <Html>
      <Head />
      <Preview>Welcome to {site.name}</Preview>
      <Body style={{ ...main, backgroundColor: colors.background }}>
        <Container style={container}>
          <Img
            src={`https://res.cloudinary.com/dn3cywkpn/image/upload/c_limit,w_2048/f_auto/q_auto/v1/${site.logo}?_a=BAVCluDW0`}
            width="150"
            alt={site.name}
            style={logo}
          />
          <Heading
            style={{
              color: colors.neutral || colors.primary,
              textAlign: "center",
              marginBottom: "50px",
            }}
          >
            Welcome to {site.name}.
          </Heading>
          <Text style={paragraph}>
            Dear {userFirstname}, <br /> Welcome to <strong>{site.name}</strong>
            ! We’re excited to have you on board and look forward to supporting
            you on your learning journey.
          </Text>
          <Text style={paragraph}>
            Your courses are designed to be engaging, practical, and aligned
            with your schedule, ensuring you can progress at a pace that works
            for you.
          </Text>
          <Text style={paragraph}>Click the button below to start today:</Text>
          <Section style={btnContainer}>
            <Button
              style={{
                ...button,
                backgroundColor: colors.primary,
                color: "#ffffff",
              }}
              href={`${site.customDomain}/dashboard`}
            >
              Get started
            </Button>
          </Section>
          <Text style={paragraph}>
            We’re grateful to be part of your learning experience.
            <br />
            Best,
            <br />
            The {site.name} Team
          </Text>
          <Text style={{ ...paragraph, fontSize: "14px", textAlign: "left" }}>
            If you have any questions or need assistance, our support team is
            here to help. You can reach us at
            <a
              style={{ paddingLeft: "4px"}}
              href={`${
                site.domainName.includes("ncec")
                  ? `https://nce.center/contact`
                  : `mailto:${site.contactEmail}`
              }`}
            >
              {site.domainName.includes("ncec") ? `https://nce.center/contact` : `${site.contactEmail}`}
            </a>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

WelcomeEmail.PreviewProps = {
  userFirstname: "Alan",
  site: {
    name: "Acme",
    logo: "courseCovers/z4o7fbpselehs3jmt1rg",
    domainName: "https://ncec.cubite.io",
    themeName: "winter",
    contactEmail: "hello@cubite.io",
    customDomain: "https://mrjohnstestprep.com",
  },
} as WelcomeEmailProps;

export default WelcomeEmail;

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
  borderRadius: "3px",
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
