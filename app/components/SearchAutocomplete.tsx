import {
    Autocomplete,
    TextField
} from "@mui/material"
interface SearchAutocompleteProps<T> {
    data: T[];
    getLabel: (option: T) => string;
    onSelect: (value: T | null) => void;
    optionsValues: (option: T, value: T) => boolean
    label: string
}

export function SearchAutocomplete<T>({
    data,
    getLabel,
    onSelect,
    optionsValues,
    label
}: SearchAutocompleteProps<T>) {
    return (
        <Autocomplete
            options={data || []}
            getOptionLabel={getLabel}
            isOptionEqualToValue={optionsValues}
            onChange={(_, newValue) => onSelect(newValue)}
            renderInput={(params) => (
                <TextField  {...params} label={label} variant="outlined" margin="normal" />
            )}
            noOptionsText="No hay elementos"
        />
    );
}
export default SearchAutocomplete;          