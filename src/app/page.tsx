import LoginForm from "@/components/LoginForm";
import Todos from "@/components/Todos";

export default function Home() {
  return (
    <main className="bg-black flex min-h-screen flex-col items-center justify-center">
      <LoginForm />
      <Todos />
    </main>
  );
}
