import React from 'react';
import { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import UndoRedo from './undoRedo';
import SelectShape from './SelectShape';
import PickColor from './PickColor';
import PickLinewidth from './PickLinewidth';
import PickMode from './PickMode';
import PickBackground from './PickBackground';
import PickImage from './PickImage';
import PickFontSize from './PickFontSize';

export default function Toolbox() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <motion.button
        className="btn-icon absolute bottom-1/2 -left-2 z-50 h-10 w-10 rounded-full bg-black text-2xl transition-none lg:hidden"
        animate={{ rotate: isOpen ? 0 : 180 }}
        transition={{ duration: 0.2, ease: [0.6, 0.01, -0.05, 0.9] }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiChevronRight />
      </motion.button>
      <motion.div
       className="absolute left-10 top-1/2 z-50 grid grid-cols-2 items-center gap-6 rounded-2xl bg-gray-800 p-6 text-white shadow-2xl transform -translate-y-1/2 lg:left-2 xl:left-4"
        animate={{
          x: isOpen ? 0 : -160,
          y: '-50%',
        }}
        transition={{
          duration: 0.2,
          ease: [0.6, 0.01, -0.05, 0.9],
        }}
      >
        <UndoRedo />
        <div className="col-span-2 h-0.5 w-full bg-gray-600 my-2" />
        <SelectShape />
        <PickColor />
        <PickLinewidth />
        <PickMode />
        <PickFontSize />
        <PickImage />
        <PickBackground />
      </motion.div>
    </>
  );
}


// import React, { useState } from 'react';
// import { FiChevronRight } from 'react-icons/fi';
// import { motion } from 'framer-motion';
// import UndoRedo from './undoRedo';
// import SelectShape from './SelectShape';
// import PickColor from './PickColor';
// import PickLinewidth from './PickLinewidth';
// import PickMode from './PickMode';
// import PickBackground from './PickBackground';
// import PickImage from './PickImage';
// import PickFontSize from './PickFontSize';

// export default function Toolbox() {
//   const [isOpen, setIsOpen] = useState(true);

//   return (
//     <>
//       <motion.button
//         className="btn-icon absolute bottom-1/2 -left-2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-2xl text-white transition-transform duration-300 hover:bg-blue-700 focus:outline-none lg:hidden"
//         animate={{ rotate: isOpen ? 0 : 180 }}
//         transition={{ duration: 0.2, ease: [0.6, 0.01, -0.05, 0.9] }}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <FiChevronRight />
//       </motion.button>
//       <motion.div
//         className="absolute left-10 top-1/2 z-50 grid grid-cols-2 items-center gap-6 rounded-2xl bg-gray-800 p-6 text-white shadow-2xl transform -translate-y-1/2 lg:left-2 xl:left-4"
//         animate={{
//           x: isOpen ? 0 : -180,
//         }}
//         transition={{
//           duration: 0.2,
//           ease: [0.6, 0.01, -0.05, 0.9],
//         }}
//       >
//         <UndoRedo />
//         <div className="col-span-2 h-0.5 w-full bg-gray-600 my-2" />
//         <SelectShape />
//         <PickColor />
//         <PickLinewidth />
//         <PickMode />
//         <PickFontSize />
//         <PickImage />
//         <PickBackground />
//       </motion.div>
//     </>
//   );
// }
