type WelcomeBannerProps = {
  name: string;
  subtitle?: string;
};

function WelcomeBanner({
  name,
  subtitle = "Your dashboard is updated with the latest metrics and insights",
}: WelcomeBannerProps) {
  return (
    <div className="mb-6 rounded-lg bg-[#5F2F8B] px-6 py-5 text-white shadow">
      <h2 className="text-lg font-semibold">
        Welcome Back, {name}!
      </h2>
      <p className="mt-1 text-sm text-white/80">
        {subtitle}
      </p>
    </div>
  );
}

export default WelcomeBanner;
