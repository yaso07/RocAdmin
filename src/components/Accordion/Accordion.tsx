import React, { useState,FC } from 'react';
import "./Accordion.css"

interface AccordionProps {
    title: string;
    content: React.ReactNode;
  }

const Accordion:FC<AccordionProps>= ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`accordion ${isOpen ? 'open' : 'closed'}`}>
      <div className={`accordion-header ${isOpen ? 'open' : 'closed'}`} onClick={toggleAccordion}>
        <h2>{title}</h2>
        <span className="accordion-arrow">{isOpen ? '▼' :'▲'}</span>
      </div>
      {isOpen && <div className="accordion-content">{content}</div>}
    </div>
  );
};

export default Accordion;
