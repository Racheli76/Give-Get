import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
} from '@mui/material';
import { TalentType } from '../../Types/123types';

interface TalentSelectionProps {
  talents: TalentType[];
  subTalents: { [key: number]: TalentType[] };
  offeredTalents: number[];  // כישרונות מוצעים
  wantedTalents: number[];   // כישרונות רצויים
  handleTalentChange: (e: SelectChangeEvent<number[]>, type: 'offered' | 'wanted') => void;
  isTalentChecked: (talentId: number, type: 'offered' | 'wanted') => boolean;
}

const TalentSelection: React.FC<TalentSelectionProps> = ({
  talents,
  subTalents,
  offeredTalents,
  wantedTalents,
  handleTalentChange,
  isTalentChecked,
}) => {
  // בחירת כישרונות מוצעים ורצויים לפי הצורך
  const handleOfferedTalentChange = (e: SelectChangeEvent<number[]>) => {
    handleTalentChange(e, 'offered');
  };

  const handleWantedTalentChange = (e: SelectChangeEvent<number[]>) => {
    handleTalentChange(e, 'wanted');
  };

  return (
    <>
      {/* הצגת כישרונות מוצעים */}
      <FormControl margin="normal" fullWidth>
        <InputLabel id="offered-talents-label">כישורים מוצעים</InputLabel>
        <Select
          labelId="offered-talents-label"
          multiple
          value={offeredTalents}
          onChange={handleOfferedTalentChange}
          renderValue={(selected) =>
            selected
              .map(
                (id) => talents.find((talent) => talent.id === id)?.talentName || ''
              )
              .join(', ')
          }
        >
          {talents.map((talent) => (
            <MenuItem key={talent.id} value={talent.id}>
              <Checkbox checked={isTalentChecked(talent.id, 'offered')} />
              <ListItemText primary={talent.talentName || 'כישרון ללא שם'} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* הצגת תתי כישרונות עבור המוצעים */}
      {offeredTalents.map((talentId) =>
        subTalents[talentId] && subTalents[talentId].length > 0 ? (
          <FormControl key={talentId} margin="normal" fullWidth>
            <InputLabel id={`sub-talents-label-${talentId}`}>
              תתי כישורים מוצעים ל-
              {talents.find((talent) => talent.id === talentId)?.talentName}
            </InputLabel>
            <Select
              labelId={`sub-talents-label-${talentId}`}
              multiple
              value={offeredTalents}
              onChange={handleOfferedTalentChange}
              renderValue={(selected: any) =>
                subTalents[talentId]
                  .filter((talent) => selected.includes(talent.id))
                  .map((talent) => talent.talentName)
                  .join(', ')
              }
            >
              {subTalents[talentId].map((subTalent) => (
                <MenuItem key={subTalent.id} value={subTalent.id}>
                  <Checkbox checked={offeredTalents.includes(subTalent.id)} />
                  <ListItemText primary={subTalent.talentName || 'כישרון ללא שם'} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : null
      )}

      {/* הצגת כישרונות רצויים */}
      <FormControl margin="normal" fullWidth>
        <InputLabel id="wanted-talents-label">כישורים רצויים</InputLabel>
        <Select
          labelId="wanted-talents-label"
          multiple
          value={wantedTalents}
          onChange={handleWantedTalentChange}
          renderValue={(selected) =>
            selected
              .map(
                (id) => talents.find((talent) => talent.id === id)?.talentName || ''
              )
              .join(', ')
          }
        >
          {talents.map((talent) => (
            <MenuItem key={talent.id} value={talent.id}>
              <Checkbox checked={isTalentChecked(talent.id, 'wanted')} />
              <ListItemText primary={talent.talentName || 'כישרון ללא שם'} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* הצגת תתי כישרונות עבור הרצויים */}
      {wantedTalents.map((talentId) =>
        subTalents[talentId] && subTalents[talentId].length > 0 ? (
          <FormControl key={talentId} margin="normal" fullWidth>
            <InputLabel id={`sub-talents-label-${talentId}`}>
              תתי כישורים רצויים ל-
              {talents.find((talent) => talent.id === talentId)?.talentName}
            </InputLabel>
            <Select
              labelId={`sub-talents-label-${talentId}`}
              multiple
              value={wantedTalents}
              onChange={handleWantedTalentChange}
              renderValue={(selected: any) =>
                subTalents[talentId]
                  .filter((talent) => selected.includes(talent.id))
                  .map((talent) => talent.talentName)
                  .join(', ')
              }
            >
              {subTalents[talentId].map((subTalent) => (
                <MenuItem key={subTalent.id} value={subTalent.id}>
                  <Checkbox checked={wantedTalents.includes(subTalent.id)} />
                  <ListItemText primary={subTalent.talentName || 'כישרון ללא שם'} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : null
      )}
    </>
  );
};

export default TalentSelection;
