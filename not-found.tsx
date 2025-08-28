// app/not-found.tsx
import Link from "next/link";
export default function NotFound() {
  return (
    <main style={{ padding: 24 }}>
      <h1>ページが見つかりません</h1>
      <p>URLが間違っているか、削除された可能性があります。</p>
      <p><Link href="/">トップに戻る</Link></p>
    </main>
  );
}
