import { Resend } from "resend";
import WelcomeTemplate from "@/emails/WelcomeTemplate";
import EnrollmentTemplate from "@/emails/EnrollmentTemplate";
import PasswordResetTemplate from "@/emails/PasswordResetTemplate";
import AddAdminEmail from "@/emails/AddAdminTemplate";
import PaidEnrollmentTemplate from "@/emails/PaidEnrollmentTemplate"
import OpenEnrollmentStopTemplate from "@/emails/OpenEnrollmentStopTemplate"
import { NextRequest, NextResponse } from "next/server";
import SupportEmail from "@/emails/SupportEmail";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Check if the RESEND_API_KEY environment variable is set
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        status: 500,
        message: "Server configuration error: API key missing.",
      });
    }

    const body = await request.json();
    if (body.type === "welcome") {
      // Validate the input
      const { userFirstname, to, subject, site } = body;
      if (!userFirstname || !to || !subject || !site) {
        return NextResponse.json({
          status: 400,
          message: "Bad Request: 'name', 'to', and 'subject' are required.",
        });
      }

      // Send the email
      const emailResponse = await resend.emails.send({
        from: `${site.name} <${site.contactEmail ? site.contactEmail : "devops@cubite.dev"}>`,
        to,
        subject,
        reply_to: `${site.contactEmail ? site.contactEmail : "devops@cubite.dev"}`,
        react: <WelcomeTemplate userFirstname={userFirstname} site={site} />,
      });
      return NextResponse.json({
        status: 200,
        message: "Email sent successfully.",
        emailResponse,
      });
    } else if (body.type === "enrollment") {
      // Validate the input
      const { userFirstname, to, site, subject, course } = body;
      if (!userFirstname || !to || !subject || !site || !course) {
        return NextResponse.json({
          status: 400,
          message:
            "Bad Request: 'name', 'to', 'subject', 'site', and 'course' are required.",
        });
      }

      // Send the email
      const emailResponse = await resend.emails.send({
        from: `${site.name} <${site.contactEmail ? site.contactEmail : "devops@cubite.dev"}>`,
        to,
        subject,
        reply_to: `${site.contactEmail ? site.contactEmail : "devops@cubite.dev"}`,
        react: (
          <EnrollmentTemplate
            userFirstname={userFirstname}
            site={site}
            course={course}
          />
        ),
      });
      return NextResponse.json({
        status: 200,
        message: "Email sent successfully.",
        emailResponse,
      });
    } else if (body.type === "openEnrollmentStop") {
      // Validate the input
      const { userFirstname, to, site, subject, course } = body;
      if (!userFirstname || !to || !subject || !site || !course) {
        return NextResponse.json({
          status: 400,
          message:
            "Bad Request: 'name', 'to', 'subject', 'site', and 'course' are required.",
        });
      }

      // Send the email
      const emailResponse = await resend.emails.send({
        from: `${site.name} <${site.contactEmail ? site.contactEmail : "devops@cubite.dev"}>`,
        to,
        subject,
        reply_to: `${site.contactEmail ? site.contactEmail : "devops@cubite.dev"}`,
        react: (
          <OpenEnrollmentStopTemplate
            userFirstname={userFirstname}
            site={site}
            course={course}
          />
        ),
      });
      return NextResponse.json({
        status: 200,
        message: "Email sent successfully.",
        emailResponse,
      });
    } else if (body.type === "password-reset") {
      const { email, token } = body;
      let { site } = body;
      if (!site) {
        site = {
          name: process.env.NEXT_PUBLIC_MAIN_DOMAIN,
          logo: "courseCovers/z4o7fbpselehs3jmt1rg",
          domainName: process.env.NEXT_PUBLIC_ROOT_URL,
          themeName: "lofi",
        };
      }
      if (!email || !token) {
        return NextResponse.json({
          status: 400,
          message: "Bad Request: 'email' and 'token' are required.",
        });
      }
      const emailResponse = await resend.emails.send({
        from: `${site.name} <${site.contactEmail ? site.contactEmail : "devops@cubite.dev"}>`,
        to: email,
        subject: "Password Reset",
        reply_to: `${site.contactEmail ? site.contactEmail : "devops@cubite.dev"}`,
        react: <PasswordResetTemplate email={email} token={token} site={site} />,
      });
      return NextResponse.json({
        status: 200,
        message: "Email sent successfully.",
        emailResponse,
      });
    } else if (body.type === "add-admin") {
      const { name, email, site } = body;

      const emailResponse = await resend.emails.send({
        from: `${site.name} <devops@cubite.dev>`,
        to: email,
        reply_to: `${site.contactEmail ? site.contactEmail : "devops@cubite.dev"}`,
        subject: "You have been added as an admin to the site " + site.name,
        react: <AddAdminEmail name={name} site={site} />,
      });
    } else if (body.type === "paidEnrollment") {
        // Validate the input
        const { userFirstname, to, site, subject, course } = body;
        if (!userFirstname || !to || !subject || !site || !course) {
          return NextResponse.json({
            status: 400,
            message:
              "Bad Request: 'name', 'to', 'subject', 'site', and 'course' are required.",
          });
        }
  
        // Send the email
        const emailResponse = await resend.emails.send({
          from: `${site.name} <${site.contactEmail ? site.contactEmail : "devops@cubite.dev"}>`,
          to,
          subject,
          reply_to: `${site.contactEmail ? site.contactEmail : "devops@cubite.dev"}`,
          react: (
            <PaidEnrollmentTemplate
              userFirstname={userFirstname}
              site={site}
              course={course}
            />
          ),
        });
        return NextResponse.json({
          status: 200,
          message: "Email sent successfully.",
          emailResponse,
        });
    } else if (body.type === "support") {
      const { subject, message, metadata, site } = body;
      if (!subject || !message || !site || !metadata) {
        return NextResponse.json({
          status: 400,
          message: "Bad Request: 'subject', 'message', 'metadata', and 'site' are required.",
        });
      }
      const emailResponse = await resend.emails.send({
        from: `${metadata.user.email} <${site.contactEmail ? site.contactEmail : "devops@cubite.dev"}>`,
        to: ["devops@cubite.io", site.contactEmail && site.contactEmail],
        reply_to: metadata.user.email,
        subject: `Support Request: ${subject}`,
        react: <SupportEmail subject={subject} message={message} metadata={metadata} site={site} />,
      });
      
      return NextResponse.json({
        status: 200,
        message: "Support request sent successfully",
        emailResponse,
      });
    }

  } catch (error) {
    console.error("Error sending email:", error);
    // Return error response
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error: Unable to send email.",
      error: error.message,
    });
  }
}
