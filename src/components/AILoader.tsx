"use client";
import React from "react";

const BlobLoader = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 flex items-center justify-center">
      {/* Red blob */}
      <div className="absolute w-[400px] h-[400px] bg-red-500 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob" />
      {/* Green blob */}
      <div className="absolute w-[400px] h-[400px] bg-green-500 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      {/* Blue blob */}
      <div className="absolute w-[400px] h-[400px] bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(200px, -100px) scale(1.2);
          }
          66% {
            transform: translate(-150px, 100px) scale(0.8);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 8s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default BlobLoader;
