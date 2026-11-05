import { TVF3DIsometricShowcase } from '@/components/showcase/tvf-3d-isometric-showcase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Interactive Experience | TheViralFinds (TVF)',
  description: 'Explore the 5-stage autonomous AI viral affiliate marketing engine in interactive 3D isometric WebGL.',
};

export default function ShowcasePage() {
  return (
    <main className="w-full h-screen overflow-hidden bg-[#07090e]">
      <TVF3DIsometricShowcase />
    </main>
  );
}
