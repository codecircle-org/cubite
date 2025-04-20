// https://community.hetzner.com/tutorials/custom-os-images-with-packer

source "hcloud" "base-amd64" {
  image         = "ubuntu-24.04"
  location      = "nbg1"
  server_type   = "cax31"
  ssh_keys      = ["Amir"]
  user_data     = ""
  ssh_username  = "root"
  snapshot_name = "openedx-tutor-img"
  snapshot_labels = {
    base    = "ubuntu-24.04",
    version = "v1.0.0",
    name    = "openedx-tutor-img"
  }
}

build {
  sources = ["source.hcloud.base-amd64"]
  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive"
    ]
    inline = [
      "sudo apt-get update -y",
      "sudo apt-get upgrade -y",
      "sudo apt-get install -y python3 python3-pip libyaml-dev python3.12-venv",
      
      # Install Docker using official Docker repository
      "sudo apt-get install -y ca-certificates curl gnupg",
      "sudo install -m 0755 -d /etc/apt/keyrings",
      "sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc",
      "sudo chmod a+r /etc/apt/keyrings/docker.asc",
      "echo \"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable\" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null",
      "sudo apt-get update",
      "sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin",
      
      # Setup Python virtual environment and install Tutor
      "python3 -m venv /root/venv",
      ". /root/venv/bin/activate",  # Using . instead of source
      "pip install 'tutor[full]'",
      "tutor local launch -I",
    ]
    execute_command = "bash -c '{{ .Vars }} {{ .Path }}'"  # Explicitly use bash
  }
}