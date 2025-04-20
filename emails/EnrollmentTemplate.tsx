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

interface EnrollmentProps {
  userFirstname: string;
  site: {
    name: string;
    logo: string;
    domainName: string;
    themeName: string;
    contactEmail: string;
    customDomain: string;
  };
  course: {
    name: string;
    isWaitList: boolean;
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

export const EnrollmentEmail = ({
  userFirstname,
  site,
  course,
}: EnrollmentProps) => {
  const colors =
    themeColors[site.themeName as keyof typeof themeColors] || themeColors.ncec;

  // Create gradient background style
  const gradientBackground = {
    background: `linear-gradient(135deg, ${colors.primary} 50%, ${colors.secondary} 100%)`,
    padding: "40px 20px",
    marginBottom: "24px",
  };

  return (
    <Html>
      <Head />
      <Preview>Enrollment to {course.name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={gradientBackground}>
            <Heading
              style={{
                color: "#ffffff",
                textAlign: "center",
                marginBottom: "24px",
                fontSize: "18px",
                fontWeight: "400",
              }}
            >
              You Successfully Enrolled in <br />
              <Text
                style={{
                  color: "#ffffff",
                  display: "block",
                  marginTop: "8px",
                  fontSize: "26px",
                  fontWeight: "bold",
                }}
              >
                {course.name}
              </Text>
            </Heading>
          </Section>

          <Container style={{ padding: "0 24px" }}>
            <Img
              src={`https://res.cloudinary.com/dn3cywkpn/image/upload/c_limit,w_2048/f_auto/q_auto/v1/${site.logo}?_a=BAVCluDW0`}
              width="200"
              alt={site.name}
              style={{ ...logo, marginBottom: "24px" }}
            />
            <Text style={paragraph}>Dear {userFirstname},</Text>
            {course.isWaitList ? (
              <Text style={{ ...paragraph, paddingTop: "0px" }}>
                Thank you for enrolling in <strong>{course.name}</strong> at the <strong>{site.name}</strong>. You are currently on the waitlist, and
                we’ll notify you as soon as a spot becomes available. 
                <br/>
                In the meantime, you can explore other learning opportunities and
                prepare for your journey with <strong>{site.name}</strong>.
              </Text>
            ) : (
              <Text style={paragraph}>
                You successfully enrolled in <strong>{course.name}</strong> at{" "}
                <strong>{site.name}</strong>. By clicking the button below, you
                can start your journey with <strong>{site.name}</strong>.
              </Text>
            )}

            <Section style={btnContainer}>
              {!course.isWaitList && (
                <Button
                  style={{
                    ...button,
                    backgroundColor: colors.primary,
                    color: "#ffffff",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  href={`${site.customDomain}/dashboard`}
                >
                  Start Course
                </Button>
              )}
            </Section>
            <Text
              style={{
                ...paragraph,
                fontSize: "14px",
                textAlign: "left",
                color: "#666666",
                marginTop: "32px",
              }}
            >
              If you have any questions, feel free to 
              <a
                href={`mailto:${site.contactEmail}`}
                style={{ color: colors.primary, paddingLeft: "4px", paddingRight: "4px" }}
              >
                reach out
              </a>
              to our support team. Thank you again for choosing <strong>{site.name}</strong>. We are excited to be part of your learning journey!
            </Text>
          </Container>
        </Container>
      </Body>
    </Html>
  );
};

EnrollmentEmail.PreviewProps = {
  userFirstname: "Alan",
  site: {
    name: "Acme",
    logo: "courseCovers/t26y8wjbpzj8paqyhplg",
    domainName: "https://cubite.io",
    customDomain: "https://disco.nce.center",
    themeName: "ncec",
    contactEmail: "hello@cubite.io",
  },
  course: {
    name: "Introduction to AI",
    isWaitList: false,
  },
} as EnrollmentProps;

export default EnrollmentEmail;

const main = {
  backgroundColor: "#f5f5f5", // Light gray background
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
  backgroundColor: "#ffffff", // White container background
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const logo = {
  margin: "0 auto",
  display: "block",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333333",
  margin: "16px 0",
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  borderRadius: "3px",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
  margin: "0 auto",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
