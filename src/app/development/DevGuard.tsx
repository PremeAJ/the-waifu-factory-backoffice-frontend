import Error404 from "../auth/error/404/page";

export default function DevGuard({ children }: { children: React.ReactNode }) {
   const isDevelopment = process.env.NODE_ENV === "development";
    return (isDevelopment && children || <Error404 />);
}
