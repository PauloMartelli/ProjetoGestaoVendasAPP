import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { vendas } from '../services/vendas';

const ModalDelete = ({ show, onHide, venda, onSuccess, onError }) => {
    const handleDelete = async () => {
        try {
            await vendas.desativarVendaAsync(venda.vendaID);
            onSuccess();
        } catch (error) {
            console.error('Erro ao deletar a venda:', error);
            onError('Erro ao deletar a venda.');
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Deletar Venda</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {venda && (
                    <>
                        <p>Você tem certeza que deseja deletar a venda com ID {venda.vendaID}?</p>
                        <div className="text-center">
                            <Button variant="danger" onClick={handleDelete}>
                                Deletar
                            </Button>
                        </div>
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ModalDelete;
