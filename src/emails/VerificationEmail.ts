// interface VerificationEmailProps {
//     username: string;
//     otp: string;
// }

// export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
//     return (
//         <div style={{
//             fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//             maxWidth: '600px',
//             margin: '0 auto',
//             backgroundColor: '#ffffff',
//             border: '1px solid #e0e0e0',
//             borderRadius: '8px',
//             overflow: 'hidden',
//             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
//         }}>
//             {/* Header */}
//             <div style={{
//                 backgroundColor: '#4f46e5',
//                 color: 'white',
//                 padding: '24px',
//                 textAlign: 'center' as const
//             }}>
//                 <h1 style={{ margin: 0, fontSize: '24px' }}>Verify Your Email</h1>
//             </div>
            
//             {/* Content */}
//             <div style={{ padding: '32px' }}>
//                 <h2 style={{ 
//                 marginTop: 0, 
//                 color: '#333333',
//                 fontSize: '20px'
//                 }}>
//                 Hello {username},
//                 </h2>
                
//                 <p style={{ 
//                 fontSize: '16px', 
//                 lineHeight: '1.6',
//                 color: '#555555'
//                 }}>
//                 Thank you for registering. Please use the following verification
//                 code to complete your registration:
//                 </p>
                
//                 {/* OTP Code Box */}
//                 <div style={{
//                 textAlign: 'center' as const,
//                 margin: '32px 0'
//                 }}>
//                 <div style={{
//                     display: 'inline-block',
//                     backgroundColor: '#f3f4f6',
//                     padding: '16px 32px',
//                     borderRadius: '8px',
//                     border: '2px dashed #d1d5db',
//                     fontSize: '32px',
//                     fontWeight: 'bold',
//                     letterSpacing: '8px',
//                     color: '#4f46e5'
//                 }}>
//                     {otp}
//                 </div>
//                 </div>
                
//                 <p style={{ 
//                 fontSize: '16px', 
//                 lineHeight: '1.6',
//                 color: '#555555'
//                 }}>
//                 This code will expire in 10 minutes. If you did not request this code, 
//                 please ignore this email.
//                 </p>
//             </div>
            
//             {/* Footer */}
//             <div style={{
//                 backgroundColor: '#f9fafb',
//                 padding: '24px',
//                 textAlign: 'center' as const,
//                 borderTop: '1px solid #e5e7eb',
//                 color: '#6b7280',
//                 fontSize: '14px'
//             }}>
//                 <p style={{ margin: 0 }}>
//                 © {new Date().getFullYear()} CodePilot. All rights reserved.
//                 </p>
//             </div>
//         </div>
//     );
// }

function getVerificationEmailHtml(username: string, otp: string): string {
  return `
    <div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    ">
      <!-- Header -->
      <div style="
        background-color: #4f46e5;
        color: white;
        padding: 24px;
        text-align: center;
      ">
        <h1 style="margin: 0; font-size: 24px;">Verify Your Email</h1>
      </div>
      
      <!-- Content -->
      <div style="padding: 32px;">
        <h2 style="margin-top: 0; color: #333333; font-size: 20px;">
          Hello ${username},
        </h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #555555;">
          Thank you for registering. Please use the following verification
          code to complete your registration:
        </p>
        
        <!-- OTP Code Box -->
        <div style="text-align: center; margin: 32px 0;">
          <div style="
            display: inline-block;
            background-color: #f3f4f6;
            padding: 16px 32px;
            border-radius: 8px;
            border: 2px dashed #d1d5db;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #4f46e5;
          ">
            ${otp}
          </div>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #555555;">
          This code will expire in 10 minutes. If you did not request this code, 
          please ignore this email.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="
        background-color: #f9fafb;
        padding: 24px;
        text-align: center;
        border-top: 1px solid #e5e7eb;
        color: #6b7280;
        font-size: 14px;
      ">
        <p style="margin: 0;">
          © ${new Date().getFullYear()} CodePilot. All rights reserved.
        </p>
      </div>
    </div>
  `;
}

export default getVerificationEmailHtml;