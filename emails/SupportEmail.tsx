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
    Link,
  } from "@react-email/components";
  import * as React from "react";
  
  interface SupportEmailProps {
    subject: string;
    message: string;
    metadata: {
      courseId: string;
      blockId: string;
      currentUrl: string;
      user: {
        email: string;
        name: string;
      };
      courseName: string;
    };
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
    }
    // Add other themes as needed
  };
  
  export const SupportEmail = ({ subject, message, metadata, site }: SupportEmailProps) => {
    const colors = themeColors[site.themeName as keyof typeof themeColors] || themeColors.ncec;
  
    return (
      <Html>
        <Head />
        <Preview>Support Request: {subject}</Preview>
        <Body style={{ ...main, backgroundColor: colors.background }}>
          <Container style={container}>
            <Img
              src={`https://res.cloudinary.com/dn3cywkpn/image/upload/c_limit,w_2048/f_auto/q_auto/v1/${site.logo}?_a=BAVCluDW0`}
              width="150"
              alt={site.name}
              style={logo}
            />
            <Heading style={{color: colors.neutral || colors.primary, textAlign: "center", marginBottom: "30px" }}>
              New Support Request
            </Heading>
            
            <Section style={contentSection}>
              <Text style={{...paragraph, fontWeight: "bold"}}>Subject:</Text>
              <Text style={{...paragraph, marginBottom: "20px"}}>{subject}</Text>

              <Text style={{...paragraph, fontWeight: "bold"}}>Message:</Text>
              <Text style={{...paragraph, marginBottom: "20px"}}>{message}</Text>

              <Text style={{...paragraph, fontWeight: "bold"}}>User Details:</Text>
              <Text style={paragraph}>Name: {metadata.user.name}</Text>
              <Text style={paragraph}>Email: {metadata.user.email}</Text>

              <Text style={{...paragraph, fontWeight: "bold", marginTop: "20px"}}>Course Details:</Text>
              <Text style={paragraph}>Course Name: {metadata.courseName}</Text>
              <Text style={paragraph}>Course ID: {metadata.courseId}</Text>
              <Text style={paragraph}>Block ID: {decodeURIComponent(metadata.blockId)}</Text>
              <Text style={paragraph}>URL: <Link href={metadata.currentUrl} style={{color: colors.primary}}>{metadata.currentUrl}</Link></Text>
            </Section>

            <Section style={btnContainer}>
              <Button 
                style={{ 
                  ...button, 
                  backgroundColor: colors.primary,
                  color: "#ffffff"
                }} 
                href={metadata.currentUrl}
              >
                View in Platform
              </Button>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
  SupportEmail.PreviewProps = {
    subject: "Need help with Course Navigation",
    message: "Hi, I'm having trouble accessing the video content in Module 2. The player seems to be stuck on loading.",
    metadata: {
      courseId: "course-v1:NCEC+MCHW2501-E+2025",
      courseName: "MCHW2501",
      blockId: "block-v1%3ANCEC%2BMCHW2501-E%2B2025%2Btype%40sequential%2Bblock%406d0a780bd7b3408ab42e17b28fabec09",
      currentUrl: "http://ncec.localhost:3000/course/cm6drruwl000fs6haychwpyur/learning/block/block-v1:NCEC+MCHW2501-E+2025+type@sequential+block@6d0a780bd7b3408ab42e17b28fabec09",
      user: {
        email: "amirtds+9aubsd908ansbd98@gmail.com",
        name: "Amir Tadrisi",
      }
    },
    site: {
      name: "Acme",
      logo: "courseCovers/z4o7fbpselehs3jmt1rg",
      domainName: "https://cubite.io",
      themeName: "winter",
      contactEmail: "hello@cubite.io",
      customDomain: "https://mrjohnstestprep.com",
    }
  } as SupportEmailProps;
  
  export default SupportEmail;
  
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
  
  const contentSection = {
    backgroundColor: "#f5f5f5",
    padding: "20px",
    borderRadius: "5px",
    margin: "20px 0",
  };
  