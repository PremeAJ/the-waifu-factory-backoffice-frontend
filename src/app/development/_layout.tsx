"use client";
import React from "react";
import Error404 from "../auth/error/404/page";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isDevelopment = process.env.NODE_ENV === "development";
    return (isDevelopment && children || <Error404 />);
}
