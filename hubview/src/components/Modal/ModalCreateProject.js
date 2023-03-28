import * as React from 'react';
import { Modal, TextField, Box, Typography, Button, RadioGroup, FormControlLabel, Radio, InputLabel, Select, Checkbox, ListItemText, MenuItem, OutlinedInput, FormControl } from '@mui/material';
import axios from 'axios';
import { getCookie } from '../../utils/handlePage';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};


const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 48 * 4.5 + 8,
        },
    },
};

const names = [
    'Front',
    'Back',
    'Fullstack',
    'Mobile',
    'Web',
    'Desktop',
    'IOT',
    'AI'
];

export default function ModalProject(props) {
    const { open, setOpen, getAllProjects } = props;

    const [tagField, setTagField] = React.useState([]);
    const [projectType, setProjectType] = React.useState('Projet entreprise');

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setTagField(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const createProject = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const body = {
            name: data.get('name'),
            description: data.get('description'),
            owner: getCookie("login"),
            type: projectType,
            tag: tagField,
            token: getCookie("accessToken")
        }
        axios
            .post("http://localhost:3000/project/api/v1/createProject", body)
            .then((res) => {
                event.target.reset();
                setTagField([]);
                handleClose();
                getAllProjects();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleClose = () => setOpen(false);
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>

                <Typography variant="h4" align="center" color="text.primary" gutterBottom>
                    Crée un projet:
                </Typography>
                <Box component="form" noValidate onSubmit={createProject} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Nom du projet"
                        name="name"
                        autoFocus
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        multiline
                        name="description"
                        label="Description"
                        id="description"
                        rows={4}
                    />

                    <RadioGroup
                        row
                        name="row-radio-buttons-group"
                        defaultValue="Projet entreprise"
                    >
                        <FormControlLabel value="Projet entreprise" control={<Radio />} label="Projet entreprise" onChange={(e) => setProjectType("Projet entreprise")} />
                        <FormControlLabel value="Projet personelle" control={<Radio />} label="Projet personelle" onChange={(e) => setProjectType("Projet personelle")}/>
                    </RadioGroup>

                    <FormControl sx={{ m: 1, width: 300 }} >
                        <InputLabel id="multiple-checkbox-label">Tag</InputLabel>
                        <Select
                            labelId="multiple-checkbox-label"
                            multiple
                            value={tagField}
                            onChange={handleChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {names.map((name) => (
                                <MenuItem key={name} value={name}>
                                    <Checkbox checked={tagField.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Crée le projet
                    </Button>

                </Box>
            </Box>
        </Modal>
    );
}