import "./globals.css";import {content} from "@/lib/data";
export const metadata={title:"Restaurant",description:"Restaurant website and QR menu"};
export default async function Layout({children}:{children:React.ReactNode}){const c=await content();const style={"--bg":c.colors.background,"--ink":c.colors.text,"--primary":c.colors.primary,"--accent":c.colors.accent,"--card":c.colors.card,"--heading":c.fonts.heading,"--body":c.fonts.body} as React.CSSProperties;return <html lang="en"><body style={style}>{children}</body></html>}
