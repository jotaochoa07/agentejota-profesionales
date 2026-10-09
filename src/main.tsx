import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ProfessionalServicesLanding } from './components/professional-services/ProfessionalServicesLanding';

const root = document.getElementById('root');
if (!root) throw new Error('Missing application root');

createRoot(root).render(
  <StrictMode>
    <ProfessionalServicesLanding />
  </StrictMode>,
);
