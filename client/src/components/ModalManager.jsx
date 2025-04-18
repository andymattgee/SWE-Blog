import React from 'react';
import NewEntryModal from './NewEntryModal';
import ViewEntryModal from './ViewEntryModal';
import EditEntryModal from './EditEntryModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ViewSummaryModal from './ViewSummaryModal';

const ModalManager = ({
    theme, // Add theme prop here
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
    onCloseDeleteModal,
    isSummaryModalOpen,
    onOpenSummaryModal,
    onCloseSummaryModal
}) => {
    return (
        <>
            {/* New Entry Modal */}
            {isNewEntryModalOpen && (
                <NewEntryModal
                    theme={theme} // Pass theme here
                    isOpen={isNewEntryModalOpen}
                    onClose={onCloseNewEntryModal}
                    onSubmit={handleAddEntry}
                />
            )}

            {/* View Modal */}
            {isModalOpen && !isEditing && selectedEntry && (
                <ViewEntryModal
                    theme={theme} // Pass theme prop here
                    entry={selectedEntry}
                    isOpen={isModalOpen}
                    onClose={onCloseModal}
                    onEdit={onEdit}
                    onDelete={onTriggerDelete} // Pass the trigger function
                    onSummarize={onOpenSummaryModal}
                    isSummaryOpen={isSummaryModalOpen} // Pass the summary modal state
                />
            )}

            {/* Edit Modal */}
            {isModalOpen && isEditing && selectedEntry && (
                <EditEntryModal
                    theme={theme} // Pass theme here
                    entry={selectedEntry}
                    isOpen={isModalOpen}
                    onClose={onCloseModal} // Reuse onCloseModal for edit mode closing
                    onUpdate={handleUpdateEntry}
                />
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    theme={theme} // Pass theme here
                    onConfirm={() => handleDelete(entryToDelete)}
                    onCancel={onCloseDeleteModal}
                />
            )}

            {/* Summary Modal */}
            {isSummaryModalOpen && selectedEntry && (
                <ViewSummaryModal
                    theme={theme} // Pass theme here
                    isOpen={isSummaryModalOpen}
                    onClose={onCloseSummaryModal}
                    entry={selectedEntry}
                />
            )}
        </>
    );
};

export default ModalManager; 