import { Leaf } from "lucide-react";

const FloatingLeaves = () => {
  const leaves = [
    { delay: "0s", duration: "12s", left: "5%", size: 18, opacity: 0.18 },
    { delay: "2s", duration: "16s", left: "15%", size: 12, opacity: 0.12 },
    { delay: "4s", duration: "14s", left: "28%", size: 16, opacity: 0.15 },
    { delay: "1s", duration: "18s", left: "38%", size: 10, opacity: 0.1 },
    { delay: "6s", duration: "20s", left: "50%", size: 14, opacity: 0.14 },
    { delay: "3s", duration: "15s", left: "62%", size: 18, opacity: 0.16 },
    { delay: "7s", duration: "17s", left: "72%", size: 11, opacity: 0.11 },
    { delay: "5s", duration: "13s", left: "82%", size: 15, opacity: 0.13 },
    { delay: "8s", duration: "19s", left: "92%", size: 13, opacity: 0.12 },
    { delay: "0.5s", duration: "21s", left: "45%", size: 9, opacity: 0.09 },
    { delay: "9s", duration: "16s", left: "20%", size: 17, opacity: 0.15 },
    { delay: "4.5s", duration: "22s", left: "75%", size: 10, opacity: 0.1 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {leaves.map((leaf, i) => (
        <div
          key={i}
          className="absolute animate-leaf-fall"
          style={{
            left: leaf.left,
            top: "-5%",
            animationDelay: leaf.delay,
            animationDuration: leaf.duration,
          }}
        >
          <Leaf
            className="animate-leaf-sway"
            style={{
              width: leaf.size,
              height: leaf.size,
              animationDelay: leaf.delay,
              color: `hsl(142 76% 52% / ${leaf.opacity})`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FloatingLeaves;
