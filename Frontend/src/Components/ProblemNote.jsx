import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Url } from '../App';
import { toast } from 'react-toastify';

function ProblemNote({ selectedProblem }) {
  const [note, setNote] = useState('');
  const [originalNote, setOriginalNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedProblem) {
      const existingNote = selectedProblem.note || '';
      setNote(existingNote);
      setOriginalNote(existingNote);
      setLoading(false);
      setIsEditing(false);
    }
  }, [selectedProblem]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await axios.patch(
        `${Url}/api/dsa/update/note/${selectedProblem._id}`,
        { note },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(' Note saved successfully!');
        setOriginalNote(response.data.data.note);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error saving note:', err);
      toast.error(' Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const isModified = note !== originalNote;

  if (loading) return <div className="p-4 text-gray-600">Loading note...</div>;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Main Canvas */}
      <div className="relative w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-xl shadow p-3 pt-2">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">📝 Problem Note</h2>

        <textarea
          className="w-full border border-gray-300 p-4 rounded-xl shadow focus:outline-blue-400 text-gray-800 resize-none"
          rows="10"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your notes here..."
          disabled={!isEditing}
          style={{ fontSize: '1rem' }}
        />
      </div>

      {/* Bottom Buttons Container */}
      <div className="w-full max-w-3xl flex justify-between mt-0.5 px-2">
        <div>
          {!isEditing && (
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              ✏️ Edit Note
            </button>
          )}
        </div>

        <div>
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={saving || !isModified}
              className={`px-4 py-2 rounded-lg text-white ${
                saving || !isModified
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } transition`}
            >
              {saving ? 'Saving...' : 'Save Note'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemNote;
