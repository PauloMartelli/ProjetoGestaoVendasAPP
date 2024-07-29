import React, { useState, useEffect } from 'react';
import { Button, Table, Container, Row, Col, Alert } from 'react-bootstrap';
import { vendas } from '../../services/vendas';
import ModalVenda from '../../components/ModalVenda';
import ModalDelete from '../../components/ModalDelete';

const Venda = () => {
    const [vendasList, setVendas] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVenda, setSelectedVenda] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchVendas();
    }, []);

    const fetchVendas = async () => {
        try {
            const vendasData = await vendas.obterVendasAsync();
            setVendas(vendasData);
        } catch (error) {
            console.error('Erro ao obter as vendas:', error);
            setErrorMessage('Erro ao obter as vendas.');
        }
    };

    const handleAddVenda = () => setShowAddModal(true);
    const handleEditVenda = (venda) => {
        setSelectedVenda(venda);
        setShowEditModal(true);
    };
    const handleDeleteVenda = (venda) => {
        setSelectedVenda(venda);
        setShowDeleteModal(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-md-center">
                <Col md={12}>
                    <Button variant="primary" onClick={handleAddVenda} className="mb-3">
                        Nova Venda
                    </Button>
                    {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
                    {errorMessage && <Alert variant="danger" className="mb-3">{errorMessage}</Alert>}
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Valor</th>
                                <th>Tipo de Pagamento</th>
                                <th>Data e Hora</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendasList.map((venda) => (
                                <tr key={venda.vendaID}>
                                    <td>{venda.vendaID}</td>
                                    <td>{venda.valor.toFixed(2)}</td>
                                    <td>
                                        {venda.tipoPagamentoId === 1 && 'Dinheiro'}
                                        {venda.tipoPagamentoId === 2 && 'Pix'}
                                        {venda.tipoPagamentoId === 3 && 'Cartão Débito'}
                                        {venda.tipoPagamentoId === 4 && 'Cartão Crédito'}
                                    </td>
                                    <td>{formatDate(venda.dataEHora)}</td>
                                    <td>
                                        <Button variant="warning" onClick={() => handleEditVenda(venda)} className="m-1">
                                            Editar
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDeleteVenda(venda)} className="m-1">
                                            Deletar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <ModalVenda
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                onSuccess={() => {
                    fetchVendas();
                    setShowAddModal(false);
                    setSuccessMessage('Venda adicionada com sucesso!');
                }}
                onError={(message) => setErrorMessage(message)}
            />

            {selectedVenda && (
                <ModalVenda
                    show={showEditModal}
                    onHide={() => setShowEditModal(false)}
                    venda={selectedVenda}
                    onSuccess={() => {
                        fetchVendas();
                        setShowEditModal(false);
                        setSuccessMessage('Venda atualizada com sucesso!');
                    }}
                    onError={(message) => setErrorMessage(message)}
                />
            )}

            {selectedVenda && (
                <ModalDelete
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    venda={selectedVenda}
                    onSuccess={() => {
                        fetchVendas();
                        setShowDeleteModal(false);
                        setSuccessMessage('Venda deletada com sucesso!');
                    }}
                    onError={(message) => setErrorMessage(message)}
                />
            )}
        </Container>
    );
};

export default Venda;
