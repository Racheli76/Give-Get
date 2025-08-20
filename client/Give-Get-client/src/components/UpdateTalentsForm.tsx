// import { useEffect, useState } from 'react';
// import { fetchTalentsByUserId,  updateUserData} from '../apis/talentUser';
// import { fetchTalentsByParent } from '../apis/talentApi';
// interface Talent {
//   id: number;
//   name: string;
//   parentId: number | null;
// }

// interface TalentUserDto {
//   userId: number;
//   talentId: number;
//   isOffered: boolean;
// }

// const UpdateTalentsForm = ({ userId }: { userId: number }) => {
//   const [allTalents, setAllTalents] = useState<Talent[]>([]); // כל הכישרונות
//   const [selectedGive, setSelectedGive] = useState<number[]>([]); // כישרונות שאני מציע
//   const [selectedRequest, setSelectedRequest] = useState<number[]>([]); // כישרונות שאני מחפש
//   const [expanded, setExpanded] = useState<number[]>([]); // אבא שפותחים אותו

//   // מאפיין את הכישרונות לפי ההורה שלהם
//   const [childTalents, setChildTalents] = useState<{ [key: number]: Talent[] }>({});

//   useEffect(() => {
//     const loadUserTalents = async () => {
//       try {
//         // טוען את כל הכישרונות לצורך הצגה
//         const talents = await fetchTalentsByParent(0);
//         setAllTalents(talents);

//         // טוען את הכישרונות של המשתמש מה-DB
//         const userTalents: TalentUserDto[] = await fetchTalentsByUserId(userId);
//         console.log('כישרונות מה-DB:', userTalents);

//         // מיון לפי IsOffered
//         const give = userTalents.filter(t => t.isOffered).map(t => t.talentId);
//         const request = userTalents.filter(t => !t.isOffered).map(t => t.talentId);

//         setSelectedGive(give);
//         setSelectedRequest(request);

//         // טוען את כל הכישרונות תחת כל כישרון אב (הילדים)
//         const talentsByParent: { [key: number]: Talent[] } = {};
//         for (const talent of talents) {
//           if (talent.parentId !== null) {
//             if (!talentsByParent[talent.parentId]) {
//               talentsByParent[talent.parentId] = [];
//             }
//             talentsByParent[talent.parentId].push(talent);
//           }
//         }
//         setChildTalents(talentsByParent);

//       } catch (error) {
//         console.error('שגיאה בטעינת נתונים:', error);
//       }
//     };

//     loadUserTalents();
//   }, [userId]);

//   const handleCheckboxChange = (
//     talentId: number,
//     type: 'give' | 'request'
//   ) => {
//     if (type === 'give') {
//       setSelectedGive(prev =>
//         prev.includes(talentId) ? prev.filter(id => id !== talentId) : [...prev, talentId]
//       );
//     } else {
//       setSelectedRequest(prev =>
//         prev.includes(talentId) ? prev.filter(id => id !== talentId) : [...prev, talentId]
//       );
//     }
//   };

//   const handleSave = async () => {
//     const talentsDto: TalentUserDto[] = [
//       ...selectedGive.map(talentId => ({
//         userId,
//         talentId,
//         isOffered: true,
//       })),
//       ...selectedRequest.map(talentId => ({
//         userId,
//         talentId,
//         isOffered: false,
//       })),
//     ];

//     console.log('נתונים לשמירה:', talentsDto);

//     const formData = new FormData();
//     formData.append('talents', JSON.stringify(talentsDto));

//     try {
//       await updateUserData(userId, formData);
//       alert('הנתונים נשמרו בהצלחה!');
//     } catch (err) {
//       console.error('שגיאה בשמירה:', err);
//       alert('שגיאה בשמירה');
//     }
//   };

//   const handleExpandClick = (parentId: number) => {
//     setExpanded(prev => 
//       prev.includes(parentId) ? prev.filter(id => id !== parentId) : [...prev, parentId]
//     );
//   };

//   return (
//     <div>
//       <h2>כישרונות שאני מציע</h2>
//       {allTalents.map(talent => (
//         <div key={talent.id}>
//           <input
//             type="checkbox"
//             checked={selectedGive.includes(talent.id)}
//             onChange={() => handleCheckboxChange(talent.id, 'give')}
//           />
//           {talent.name}

//           {/* לחצן לפתיחת ילדים (אם יש) */}
//           {childTalents[talent.id] && (
//             <button onClick={() => handleExpandClick(talent.id)}>
//               {expanded.includes(talent.id) ? 'סגור' : 'הצג תתי-כישרונות'}
//             </button>
//           )}

//           {/* הצגת הילדים אם נפתח */}
//           {expanded.includes(talent.id) && childTalents[talent.id]?.map(child => (
//             <div key={child.id} style={{ marginLeft: '20px' }}>
//               <input
//                 type="checkbox"
//                 checked={selectedGive.includes(child.id)}
//                 onChange={() => handleCheckboxChange(child.id, 'give')}
//               />
//               {child.name}
//             </div>
//           ))}
//         </div>
//       ))}

//       <h2>כישרונות שאני מחפש</h2>
//       {allTalents.map(talent => (
//         <div key={talent.id}>
//           <input
//             type="checkbox"
//             checked={selectedRequest.includes(talent.id)}
//             onChange={() => handleCheckboxChange(talent.id, 'request')}
//           />
//           {talent.name}

//           {/* לחצן לפתיחת ילדים (אם יש) */}
//           {childTalents[talent.id] && (
//             <button onClick={() => handleExpandClick(talent.id)}>
//               {expanded.includes(talent.id) ? 'סגור' : 'הצג תתי-כישרונות'}
//             </button>
//           )}

//           {/* הצגת הילדים אם נפתח */}
//           {expanded.includes(talent.id) && childTalents[talent.id]?.map(child => (
//             <div key={child.id} style={{ marginLeft: '20px' }}>
//               <input
//                 type="checkbox"
//                 checked={selectedRequest.includes(child.id)}
//                 onChange={() => handleCheckboxChange(child.id, 'request')}
//               />
//               {child.name}
//             </div>
//           ))}
//         </div>
//       ))}

//       <button onClick={handleSave}>שמור</button>
//     </div>
//   );
// };

// export default UpdateTalentsForm;
export const hirtut = ()=> {console.log('end of snippet')}
