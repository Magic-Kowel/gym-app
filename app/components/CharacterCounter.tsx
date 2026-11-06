import { FormHelperText } from '@mui/material';

export const CharacterCounter = ({ value, max }: { value: number | string, max: number }) => {
    const currentLength = value ? String(value).length : 0;
    return (
        <FormHelperText style={{ textAlign: 'right', display: 'block' }}>
            {currentLength}/{max}
        </FormHelperText>
    );
};