import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { motion } from 'framer-motion';
import { Search, PlusCircle, Bookmark, Zap, ArrowRight } from 'lucide-react';
import { auth } from '../services/firebase';
import { Link } from 'react-router-dom';

// 3. 3D Background Animation
function StarBackground(props) {
  const ref = useRef();
  const [sphere] = React.useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#3b82f6"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

const HomePage = () => {
  const user = auth.currentUser;

  return (
    <div className="relative min-h-screen bg-[#020202] text-white overflow-hidden pl-32">
      {/* 3D Canvas Layer */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Suspense fallback={null}>
            <StarBackground />
          </Suspense>
        </Canvas>
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 p-8">
        <motion.header 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-16 mt-12"
        >
          <div className="inline-block bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 flex items-center gap-2">
              <Zap size={12} fill="currentColor" /> Neural Link Active
            </span>
          </div>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
            Welcome back, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">
              {user?.displayName?.split(' ')[0] || 'Operator'}
            </span>
          </h1>
        </motion.header>

        {/* 3D Hover Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Explore', icon: <Search />, path: '/explore', color: 'blue' },
            { title: 'Register', icon: <PlusCircle />, path: '/register', color: 'emerald' },
            { title: 'Saved', icon: <Bookmark />, path: '/saved', color: 'purple' }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              whileHover={{ rotateX: 10, rotateY: -10, translateZ: 50 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="perspective-1000"
            >
              <Link 
                to={item.path}
                className="group relative block p-8 bg-white/[0.02] border border-white/10 rounded-[32px] backdrop-blur-md hover:bg-white/[0.05] transition-all"
              >
                <div className={`mb-6 p-4 bg-${item.color}-500/20 w-fit rounded-2xl group-hover:scale-110 group-hover:bg-${item.color}-500/40 transition-all`}>
                  {React.cloneElement(item.icon, { size: 28, className: `text-${item.color}-400` })}
                </div>
                <h3 className="text-2xl font-bold mb-2 uppercase tracking-tight">{item.title}</h3>
                <p className="text-gray-500 text-sm font-medium mb-6">Access secure workspace data and niches.</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500">
                  Initialize <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;