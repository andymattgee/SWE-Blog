import React from 'react';
import NewEntryModal from './NewEntryModal';
import ViewEntryModal from './ViewEntryModal';
import EditEntryModal from './EditEntryModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const ModalManager = ({
    isNewEntryModalOpen,
    onCloseNewEntryModal,
    handleAddEntry,
    isModalOpen,
    selectedEntry,
    isEditing,
    onEdit,
    onCloseModal,
    handleUpdateEntry,
    onTriggerDelete, // Renamed from onDelete in ViewEntryModal to avoid conflict
    isDeleteModalOpen,
    entryToDelete,
    handleDelete,
    onCloseDeleteModal
}) => {
    return (
        <>
            {/* New Entry Modal */}
            {isNewEntryModalOpen && (
                <NewEntryModal
                    isOpen={isNewEntryModalOpen}
                    onClose={onCloseNewEntryModal}
                    onSubmit={handleAddEntry}
                />
            )}

            {/* View Modal */}
            {isModalOpen && !isEditing && selectedEntry && (
                <ViewEntryModal
                    entry={selectedEntry}
                    isOpen={isModalOpen}
                    onClose={onCloseModal}
                    onEdit={onEdit}
                    onDelete={onTriggerDelete} // Pass the trigger function
                />
            )}

            {/* Edit Modal */}
            {isModalOpen && isEditing && selectedEntry && (
                <EditEntryModal
                    entry={selectedEntry}
                    isOpen={isModalOpen}
                    onClose={onCloseModal} // Reuse onCloseModal for edit mode closing
                    onUpdate={handleUpdateEntry}
                />
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    onConfirm={() => handleDelete(entryToDelete)}
                    onCancel={onCloseDeleteModal}
                />
            )}
        </>
    );
};

export default ModalManager; 