import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { vendas } from '../services/vendas';

const ModalVenda = ({ show, onHide, venda, onSuccess, onError }) => {
    const [valor, setValor] = useState('');
    const [tipoPagamentoId, setTipoPagamentoId] = useState(1);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (venda) {
            setValor(venda.valor);
            setTipoPagamentoId(venda.tipoPagamentoId);
        }
    }, [venda]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const vendaData = {
            valor: parseFloat(valor),
            tipoPagamentoId
        };

        try {
            if (venda) {
                await vendas.atualizarVendaAsync(vendaData, venda.id);
            } else {
                await vendas.adicionarVendaAsync(vendaData);
            }
            onSuccess();
            setMessage('');
        } catch (error) {
            console.error('Erro ao salvar a venda:', error);
            onError('Erro ao salvar a venda.');
            setMessage('Erro ao salvar a venda.');
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{venda ? 'Editar Venda' : 'Nova Venda'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && <Alert variant="danger" className="mb-3">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formValor">
                        <Form.Label>Valor</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formTipoPagamento">
                        <Form.Label>Tipo de Pagamento</Form.Label>
                        <Form.Control
                            as="select"
                            value={tipoPagamentoId}
                            onChange={(e) => setTipoPagamentoId(parseInt(e.target.value))}
                            required
                        >
                            <option value={1}>Dinheiro</option>
                            <option value={2}>Pix</option>
                            <option value={3}>Cartão Débito</option>
                            <option value={4}>Cartão Crédito</option>
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">
                        {venda ? 'Atualizar Venda' : 'Adicionar Venda'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ModalVenda;
