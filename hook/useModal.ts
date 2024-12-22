'use client';

import { useState } from 'react';

const useModal = (initState = false) => {
  const [isOpen, setIsOpen] = useState(initState);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return { isOpen, openModal, closeModal };
};

export default useModal;
