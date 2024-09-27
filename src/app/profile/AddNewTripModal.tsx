'use client';

import { useRouter } from 'next/navigation';

import TripModal from '@/components/TripModal';
import { createNewTrip } from '@/lib/firebaseApi';

interface AddTripModalProps {
  onClose: () => void;
}
interface SelectedOption {
  value: string;
  label: string;
}

const AddNewTripModal: React.FC<AddTripModalProps> = ({ onClose }) => {
  const router = useRouter();
  const handleCreateTrip = async (
    tripTitle: string,
    startDate: Date,
    endDate: Date,
    selectedCountries: SelectedOption[]
  ) => {
    const tripId = await createNewTrip(tripTitle, startDate, endDate, selectedCountries);
    console.log('Trip created successfully');
    onClose();
    router.push(`/trips/${tripId}`);
  };

  return <TripModal onClose={onClose} isEditing={false} onSubmit={handleCreateTrip} />;
};
export default AddNewTripModal;
