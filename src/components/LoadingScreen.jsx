import { motion } from 'framer-motion'

const letterVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: 0.5 + i * 0.08,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  exit: (i) => ({
    opacity: 0,
    y: -20,
    filter: 'blur(4px)',
    transition: {
      delay: i * 0.04,
      duration: 0.35,
      ease: [0.4, 0, 1, 1],
    },
  }),
}

const taglineVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 1.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
}

const pulseRingVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: [0.8, 1.6, 2.2],
    opacity: [0.35, 0.15, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeOut',
      delay: 0.8,
    },
  },
}

const iconVariants = {
  hidden: { scale: 0, opacity: 0, rotate: -30 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      delay: 0.15,
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
  },
}

const progressVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      delay: 1.5,
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const brandName = 'FLUSH'

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* Icon + pulse rings */}
      <div className="relative flex items-center justify-center mb-10">
        {/* Pulse ring 1 */}
        <motion.div
          variants={pulseRingVariants}
          initial="initial"
          animate="animate"
          className="absolute w-36 h-36 rounded-full border border-primary-300/40"
        />
        {/* Pulse ring 2 - offset */}
        <motion.div
          variants={pulseRingVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 1.4 }}
          className="absolute w-36 h-36 rounded-full border border-primary-200/30"
          style={{ animationDelay: '0.6s' }}
        />

        {/* Icon — large and clean */}
        <motion.div
          variants={iconVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative z-10"
        >
          <img
            src="/FlushIcon.png"
            alt="Flush"
            className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-lg"
          />
        </motion.div>
      </div>

      {/* Brand name - letter by letter */}
      <div className="relative flex items-center justify-center mb-3">
        {brandName.split('').map((letter, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-neutral-900 font-bold tracking-tight"
            style={{
              fontSize: 'clamp(2.25rem, 8vw, 3rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>

      {/* Tagline */}
      <motion.p
        variants={taglineVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="text-neutral-400 text-sm font-medium tracking-widest uppercase"
        style={{ letterSpacing: '0.2em' }}
      >
        Find your nearest restroom
      </motion.p>

      {/* Progress bar */}
      <div className="mt-12 w-32 h-[2px] bg-neutral-200 rounded-full overflow-hidden">
        <motion.div
          variants={progressVariants}
          initial="hidden"
          animate="visible"
          className="h-full rounded-full origin-left"
          style={{
            background: 'linear-gradient(90deg, #0d9488, #2dd4bf)',
          }}
        />
      </div>

      {/* Bottom version text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 text-neutral-300 text-[11px] font-medium tracking-wider uppercase"
        style={{ letterSpacing: '0.15em' }}
      >
        Beta v1.0
      </motion.p>
    </motion.div>
  )
}
