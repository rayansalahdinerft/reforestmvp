import { Leaf } from "lucide-react";

const FloatingLeaves = () => {
  const leaves = [
    { delay: "0s", duration: "15s", left: "10%", size: 16 },
    { delay: "3s", duration: "18s", left: "25%", size: 12 },
    { delay: "6s", duration: "20s", left: "40%", size: 14 },
    { delay: "2s", duration: "16s", left: "55%", size: 10 },
    { delay: "5s", duration: "22s", left: "70%", size: 16 },
    { delay: "8s", duration: "17s", left: "85%", size: 12 },
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
            className="text-green-500/20 animate-leaf-sway"
            style={{
              width: leaf.size,
              height: leaf.size,
              animationDelay: leaf.delay,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FloatingLeaves;
