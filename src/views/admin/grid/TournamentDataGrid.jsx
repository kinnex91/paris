import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { getTournaments, createTournament, updateTournament, deleteTournament } from '../../../services/TournamentService';

const TournamentDataGrid = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tournamentCategory: '',
    tournamentDescription: '',
    startDate: '',
    endDate: '',
  });

  // Charger les tournois depuis le backend
  const fetchTournaments = async () => {
    const data = await getTournaments();
    setTournaments(data);
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    document.body.classList.add('no-background');

    // Supprimer la classe quand on quitte la page
    return () => {
      document.body.classList.remove('no-background');

    };
  }, []);

  // Gérer la création ou la mise à jour
  const handleSave = async () => {
    if (selectedTournament) {
      await updateTournament(selectedTournament.id, formData);
    } else {
      await createTournament(formData);
    }
    setIsDialogOpen(false);
    fetchTournaments();
  };

  // Gérer la suppression
  const handleDelete = async (id) => {
    await deleteTournament(id);
    fetchTournaments();
  };

  // Ouvrir le dialogue pour ajouter/modifier
  const openDialog = (tournament = null) => {
    setSelectedTournament(tournament);
    setFormData(
      tournament || {
        name: '',
        tournamentCategory: '',
        tournamentDescription: '',
        startDate: '',
        endDate: '',
      }
    );
    setIsDialogOpen(true);
  };

  // Colonnes pour le DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nom', width: 200 },
    { field: 'tournamentCategory', headerName: 'Sports Categorie ', width: 150 },
    { field: 'tournamentDescription', headerName: 'Sports Description ', width: 150 },
    { field: 'startDate', headerName: 'Start Date', width: 150 },
    { field: 'endDate', headerName: 'End Date', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => openDialog(params.row)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <div style={{ height: 600, width: '100%' }}>
      <h2>Gestion des Tournois</h2>
      <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => openDialog()}>
        Ajouter un Tournoi
      </Button>

      <DataGrid
        rows={tournaments}
        columns={columns}
        getRowId={(row) => row.id}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
      />

      {/* Dialogue pour ajouter/éditer un tournoi */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{selectedTournament ? 'Modifier' : 'Ajouter'} un Tournoi</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="tournament Category (in example Foot)"
            fullWidth
            value={formData.tournamentCategory}
            onChange={(e) => setFormData({ ...formData, tournamentCategory: e.target.value })}
          />
          <TextField
            margin="dense"
            label="tournament Description (in example Ligue 1 FR foot 2005) "
            fullWidth
            value={formData.tournamentDescription}
            onChange={(e) => setFormData({ ...formData, tournamentDescription: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Date de Début"
            type="date"
            fullWidth
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Date de Fin"
            type="date"
            fullWidth
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleSave} color="primary">
            {selectedTournament ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TournamentDataGrid;
