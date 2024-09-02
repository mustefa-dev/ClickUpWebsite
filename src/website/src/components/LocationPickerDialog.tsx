import React from "react";
import CustomDialog from "@/components/Dialog";
import LocationPicker from "@/components/LocationPicker";

interface LocationPickerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (location: { lat: number, lng: number }) => void;
}

const LocationPickerDialog: React.FC<LocationPickerDialogProps> = ({ isOpen, onClose, onSelectLocation }) => {
    return (
        <CustomDialog isOpen={isOpen} onClose={onClose} title="Choose Location">
            <LocationPicker onChange={onSelectLocation} />
        </CustomDialog>
    );
};

export default LocationPickerDialog;