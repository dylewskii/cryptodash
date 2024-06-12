import PasswordReset from "@/components/misc/PasswordReset";

export default function RequestResetPage() {
  return (
    <section className="flex justify-center items-center px-10">
      <PasswordReset showTitle={true} showLabel={true} />
    </section>
  );
}
