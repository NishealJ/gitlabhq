# rubocop:disable all
class AddPermissionCheckToUser < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :last_credential_check_at, :datetime
  end
end
