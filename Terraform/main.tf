data "azurerm_resource_group" "rg" {

  name = "Quote-RG"

}

data "azurerm_container_registry" "acr" {

  name                = "quoteregistry"
  resource_group_name = data.azurerm_resource_group.rg.name

}

resource "azurerm_kubernetes_cluster" "aks" {

  name                = "Quote-AKS"
  location            = "australia central"
  resource_group_name = data.azurerm_resource_group.rg.name
  dns_prefix          = "quote"

  default_node_pool {
    name       = "system"
    node_count = 2
    vm_size    = "Standard_B2s_v2"
  }
  identity {
    type = "SystemAssigned"
  }

}

resource "azurerm_role_assignment" "roleAssignmentToACRPull" {
  principal_id         = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
  scope                = data.azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"

}
