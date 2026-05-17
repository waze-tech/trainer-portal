import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { sessions } from '../data/mock';
import { Badge, Button } from '../components/ui';

function QRPlaceholderLarge() {
  const size = 360;
  const cells = 15;
  const cellSize = size / cells;
  // Deterministic pattern for large QR
  const pattern: number[] = [];
  for (let i = 0; i < cells * cells; i++) {
    const row = Math.floor(i / cells);
    const col = i % cells;
    // Finder patterns in corners
    if ((row < 3 && col < 3) || (row < 3 && col >= cells - 3) || (row >= cells - 3 && col < 3)) {
      pattern.push(1);
    } else if ((row === 3 && (col < 4 || col >= cells - 4)) || (col === 3 && (row < 4 || row >= cells - 4))) {
      pattern.push(0);
    } else {
      pattern.push((row * 7 + col * 13 + row * col) % 3 === 0 ? 1 : 0);
    }
  }

  return (
    <div className="bg-white p-8-2xl shadow-lg inline-block">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {pattern.map((v, i) => (
          <rect
            key={i}
            x={(i % cells) * cellSize}
            y={Math.floor(i / cells) * cellSize}
            width={cellSize}
            height={cellSize}
            fill={v ? '#1b2b1d' : 'white'}
            rx={1}
          />
        ))}
      </svg>
    </div>
  );
}

export function QRDisplay() {
  const { id } = useParams<{ id: string }>();
  const session = sessions.find(s => s.id === id);

  if (!session) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-white">Session not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center relative">
      {/* Close button */}
      <Link
        to={`/sessions/${session.id}`}
        className="absolute top-6 left-6"
      >
        <Button variant="ghost" icon={<ArrowLeft size={18} />} className="!text-white/70 hover:!text-white hover:!bg-white/10">
          Back to session
        </Button>
      </Link>

      {/* QR Code */}
      <div className="flex flex-col items-center">
        <QRPlaceholderLarge />

        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">{session.name}</h2>
          <Badge variant={session.status === 'Open' ? 'success' : 'neutral'} dot>
            {session.status}
          </Badge>
          <p className="text-white/50 text-sm mt-4">Scan with your phone camera to enroll</p>
          <p className="text-white/30 text-xs mt-1">breadcrumb.com/enroll/{session.id}</p>
        </div>
      </div>
    </div>
  );
}
