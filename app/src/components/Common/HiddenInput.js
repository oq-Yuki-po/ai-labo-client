import React ,{forwardRef} from 'react'

const HiddenInput = forwardRef(
({ onFileInputChange }, inputRef) => {
    return (
        <input
            hidden
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onFileInputChange}
        />
    );
});

export default HiddenInput